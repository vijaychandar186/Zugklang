"""Anonymise a BSON insight test fixture.

Usage:
    python anon.py insight_test_case_10.bson

Reads the BSON file, replaces every user identifier and document _id with a
random string, and writes the result to anon_insights.pkl so the fixture can
be shared without leaking real Lichess usernames.
"""
import argparse
import pickle
import random
import string
import sys

import bson


def random_word(length: int) -> str:
    return "".join(random.choices(string.ascii_lowercase, k=length))


def anonymise(path: str) -> None:
    with open(path, "rb") as f:
        data = bson.decode_all(f.read())

    users = {doc["u"] for doc in data}
    rename = {u: random_word(10) for u in users}

    for doc in data:
        doc["_id"] = random_word(8)
        doc["u"] = rename[doc["u"]]

    out_path = "anon_insights.pkl"
    with open(out_path, "wb") as f:
        pickle.dump(data, f)

    print(f"Anonymised {len(data)} documents → {out_path}")


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("bson_file", help="Path to the .bson insight fixture")
    args = parser.parse_args()
    anonymise(args.bson_file)
