#!/bin/sh

# Help: `anvil.sh --help`
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

is_anvil_running() {
    nc -z localhost 8545
}
kill_anvil() {
  if is_anvil_running; then
    pkill -f anvil
    echo "❌ Anvil killed"
  fi
}
run_anvil() {
  # Test anvil port
  if is_anvil_running; then
    echo "✅ Anvil already running."
  else
    nohup anvil > ./anvil.log &

    # Wait for: `Listening`...
    while ! grep -q "Listening" < anvil.log; do
      sleep 1
    done
    echo "✅ Anvil started"
  fi
}

# Kill anvil: `anvil.sh --kill`
if [ "$1" = "-k" ] || [ "$1" = "--kill" ]; then
  kill_anvil
  exit 0
fi

# Restart anvil: `anvil.sh --restart`
if [ "$1" = "-r" ] || [ "$1" = "--restart" ]; then
  kill_anvil
  echo "🔄 Anvil restarting..."
  run_anvil
  exit 0
fi

# Start anvil: `anvil.sh`
echo "🚀 Anvil starting"
run_anvil


