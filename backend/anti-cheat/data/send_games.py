"""
Load real games from games.csv, convert SAN→UCI, send to anti-cheat /game endpoint.
"""

import csv
import json
import os
import random
import time
import urllib.error
import urllib.request
import uuid

import chess

ANTI_CHEAT_URL = "http://localhost/anti-cheat/game"
ANALYSE_URL = "http://localhost/anti-cheat/analyse"
INTERNAL_API_SECRET = "dev-secret-123"

WHITE_USER_ID = "cmnnqg88v00002xoinva8swsb"
WHITE_USERNAME = "alice-smith"
BLACK_USER_ID = "cmnnqk3j000022xoi3lj4y4ng"
BLACK_USERNAME = "john-doe"

CSV_PATH = os.path.join(os.path.dirname(__file__), "games.csv")
GAMES_TO_SEND = 50  # send 50 real games — plenty for inference


def san_to_uci(san_moves: list[str]) -> list[str]:
    board = chess.Board()
    uci = []
    for san in san_moves:
        try:
            move = board.parse_san(san)
            uci.append(move.uci())
            board.push(move)
        except Exception:
            break  # stop at first illegal move
    return uci


def parse_increment(code: str) -> tuple[int, int]:
    """'5+10' → (5, 10). Handles edge cases."""
    try:
        parts = str(code).split("+")
        return int(float(parts[0])), int(float(parts[1])) if len(parts) > 1 else 0
    except Exception:
        return 5, 0


def make_move_times(n: int, fast: bool) -> list[int]:
    if fast:
        base = random.randint(400, 3000)
    else:
        base = random.randint(2000, 15000)
    return [max(100, int(base * random.uniform(0.2, 3.0))) for _ in range(n)]


def load_csv_games(path: str, limit: int) -> list[dict]:
    games = []
    with open(path, newline="", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if len(games) >= limit * 3:  # load extra so we can filter
                break
            san_str = row.get("moves", "").strip()
            if not san_str:
                continue
            san_list = san_str.split()
            uci_list = san_to_uci(san_list)
            if len(uci_list) < 10:  # skip very short games
                continue

            tc_min, tc_inc = parse_increment(row.get("increment_code", "5+0"))
            winner = row.get("winner", "white").strip().lower()
            if winner not in ("white", "black", "draw"):
                winner = "draw"

            games.append(
                {
                    "uci": uci_list,
                    "tc_min": tc_min,
                    "tc_inc": tc_inc,
                    "result": winner,
                    "white_rating": int(float(row.get("white_rating", 1500))),
                    "black_rating": int(float(row.get("black_rating", 1500))),
                }
            )
            if len(games) >= limit:
                break
    return games


def post(url: str, payload: dict, timeout: int = 30) -> dict:
    data = json.dumps(payload).encode()
    req = urllib.request.Request(
        url,
        data=data,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {INTERNAL_API_SECRET}",
        },
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        return json.loads(resp.read())


def main():
    print(f"Loading up to {GAMES_TO_SEND} games from {CSV_PATH}...")
    games = load_csv_games(CSV_PATH, GAMES_TO_SEND)
    print(f"Loaded {len(games)} usable games.\n")

    total = errors = 0
    for i, g in enumerate(games):
        uci = g["uci"]
        n = len(uci)
        fast = (g["tc_min"] * 60 + g["tc_inc"] * 40) < 600
        swap = i % 2 == 1  # alternate who plays white

        result = g["result"]
        if swap:
            wid, wname = BLACK_USER_ID, BLACK_USERNAME
            bid, bname = WHITE_USER_ID, WHITE_USERNAME
            result = {"white": "black", "black": "white", "draw": "draw"}[result]
        else:
            wid, wname = WHITE_USER_ID, WHITE_USERNAME
            bid, bname = BLACK_USER_ID, BLACK_USERNAME

        payload = {
            "game_id": str(uuid.uuid4()),
            "variant": "standard",
            "time_control_minutes": g["tc_min"],
            "time_control_increment": g["tc_inc"],
            "moves": uci,
            "move_times_white_ms": make_move_times((n + 1) // 2, fast),
            "move_times_black_ms": make_move_times(n // 2, fast),
            "white_user_id": wid,
            "white_username": wname,
            "black_user_id": bid,
            "black_username": bname,
            "white_rating": g["white_rating"],
            "black_rating": g["black_rating"],
            "result": result,
        }

        try:
            resp = post(ANTI_CHEAT_URL, payload)
            wm = resp.get("white_moves_stored", 0)
            bm = resp.get("black_moves_stored", 0)
            ok = "OK" if resp.get("stored") else "SKIP"
            tc_s = f"{g['tc_min']}+{g['tc_inc']}"
            print(
                f"  [{i + 1:2d}] {tc_s:6s} | {result:5s} | {n:3d} ply | "
                f"white={wm:3d} black={bm:3d} stored | {ok}"
            )
            total += 1
        except Exception as e:
            print(f"  [{i + 1:2d}] ERROR — {e}")
            errors += 1

        time.sleep(0.3)

    print(f"\n=== Sent {total} games, {errors} errors ===")

    # Brief pause so queue worker can start processing
    print("\nWaiting 8s for queue worker to process...")
    time.sleep(8)

    print("\nTriggering /analyse for both users...")
    try:
        resp = post(ANALYSE_URL, {"users": [WHITE_USER_ID, BLACK_USER_ID]}, timeout=120)
        results = resp.get("results", [])
        if not results:
            print("\nNo predictions returned yet.")
            print("Possible reasons:")
            print("  • Not enough moves per insight bucket (need more diverse games)")
            print(
                "  • Model artifact not present (run: docker exec zugklang-anti-cheat-dev python generate_synthetic_artifacts.py)"
            )
        else:
            print("\n=== Predictions ===")
            for r in results:
                tc_label = "bullet/blitz" if r["tc"] == 2 else "rapid/classical"
                pred = r["pred"]
                flag = (
                    "*** SUSPICIOUS ***"
                    if pred > 0.7
                    else ("borderline" if pred > 0.4 else "clean")
                )
                print(
                    f"  {r['user'][:28]:28s} | {tc_label:15s} | {r['days']}d | pred={pred:.4f}  {flag}"
                )
                for k in ["insight_1", "insight_2", "insight_3"]:
                    if r.get(k):
                        print(f"    {k}: {r[k]}")
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"Analysis HTTP {e.code}: {body}")
    except Exception as e:
        print(f"Analysis failed: {e}")


if __name__ == "__main__":
    main()
