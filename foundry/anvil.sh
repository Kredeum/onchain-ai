#!/bin/sh

// Help: `anvil.sh --help`
if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  echo "Run 'anvil' if not already running"
  echo "Returns after 'Listening', continue to run in background, output logs to 'anvil.log'"
  echo

  echo "Usage: ./anvil.sh [OPTION]"
  echo

  echo "Option:"
  echo "   -r, --restart    to restart anvil"
  echo "   -k  --kill       to kill anvil"
  echo

  exit 0
fi

// Kill anvil: `anvil.sh --kill`
if [ "$1" = "-k" ] || [ "$1" = "--kill" ]; then
  pkill -f anvil
  exit 0
fi

// Restart anvil: `anvil.sh --restart`
if [ "$1" = "-r" ] || [ "$1" = "--restart" ]; then
  pkill -f anvil
fi

// Test anvil port
if nc -z localhost 8545; then
  // Echo only
  echo "Anvil already running."
else
  // Start anvil
  echo "Starting Anvil..." `pwd`
  anvil > ./anvil.log &

  // Wait for: `Listening`...
  while ! grep -q "Listening" < anvil.log; do
    sleep 1
  done
fi

