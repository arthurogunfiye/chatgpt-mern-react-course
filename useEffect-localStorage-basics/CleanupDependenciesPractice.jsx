import { useEffect, useState } from 'react';

function CleanupDependenciesPractice() {
  const [ticks, setTicks] = useState(0);
  const [delayMs, setDelayMs] = useState(1000);

  useEffect(() => {
    console.log(`Timer setup: ${delayMs}ms`);

    // TODO 1:
    // Create an interval using setInterval().
    // Store its identifier in timerId.
    // Use delayMs as the interval duration.

    // TODO 2:
    // Inside the interval callback,
    // increase ticks by 1 using
    // a functional state update.
    const timerId = setInterval(() => {
      setTicks(prevTicks => prevTicks + 1);
    }, delayMs);

    return () => {
      console.log(`Timer cleanup: ${delayMs}ms`);

      // TODO 3:
      // Stop the previous interval.
      clearInterval(timerId);
    };
  }, [
    // TODO 4:
    // Add the dependency that controls
    // how frequently the interval runs.
    delayMs
  ]);

  return (
    <section>
      <h2>Dynamic Timer Practice</h2>

      <p>Ticks: {ticks}</p>
      <p>Interval: {delayMs}ms</p>

      <button onClick={() => setDelayMs(1000)}>Normal Speed</button>

      <button onClick={() => setDelayMs(2000)}>Slow Speed</button>
    </section>
  );
}

export default CleanupDependenciesPractice;
