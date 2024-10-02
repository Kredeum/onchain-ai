#!/bin/sh

if [ "$1" = "-h" ] || [ "$1" = "--help" ]; then
  echo "Run 'anvil' if not already running"
  echo "Return after 'Listening', continue to run in background, output logs to 'anvil.log'"
  echo

  echo "Usage: ./anvil.sh [OPTION]"
  echo

  echo "Option:"
  echo "   -r, --restart    to restart anvil"
  echo "   -k  --kill       to kill anvil"
  echo

  exit 0
fi

if [ "$1" = "-k" ] || [ "$1" = "--kill" ]; then
  pkill -f anvil
  exit 0
fi

if [ "$1" = "-r" ] || [ "$1" = "--restart" ]; then
  pkill -f anvil
fi

if nc -z localhost 8545; then
  echo "Anvil already running."
else
  echo "Starting Anvil..." `pwd`
  anvil > ./anvil.log &
fi

while ! grep -q "Listening" < anvil.log; do
  sleep 1
done

