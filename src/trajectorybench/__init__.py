"""Trajectory-level clinical reasoning evaluation."""

from .evaluator import evaluate_encounter, evaluate_suite
from .schema import Encounter, TraceEvent

__all__ = ["Encounter", "TraceEvent", "evaluate_encounter", "evaluate_suite"]
__version__ = "0.3.0"

