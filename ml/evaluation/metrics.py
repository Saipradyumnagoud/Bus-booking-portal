from __future__ import annotations
import math

def precision_at_k(recommended, relevant, k=5):
    rec = list(recommended)[:k]
    if not rec:
        return 0.0
    relevant = set(relevant)
    return sum(1 for item in rec if item in relevant) / len(rec)

def recall_at_k(recommended, relevant, k=5):
    relevant = set(relevant)
    if not relevant:
        return 0.0
    return len(set(recommended[:k]) & relevant) / len(relevant)

def ndcg_at_k(recommended, relevance_by_item, k=5):
    rec = list(recommended)[:k]
    dcg = sum((2 ** float(relevance_by_item.get(item, 0)) - 1) / math.log2(i + 2)
              for i, item in enumerate(rec))
    ideal = sorted((float(v) for v in relevance_by_item.values()), reverse=True)[:k]
    idcg = sum((2 ** value - 1) / math.log2(i + 2) for i, value in enumerate(ideal))
    return dcg / idcg if idcg else 0.0

def evaluate_ranking(recommended, relevant, k=5):
    return {
        f"precision@{k}": precision_at_k(recommended, relevant, k),
        f"recall@{k}": recall_at_k(recommended, relevant, k),
    }
