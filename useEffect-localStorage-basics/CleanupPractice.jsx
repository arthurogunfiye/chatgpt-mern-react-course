import { useEffect, useState } from 'react';

function CleanupPractice() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // TODO 1:
    // Start an interval that runs every 1000ms.
    // Store its identifier in timerId.
    // TODO 2:
    // Inside the interval callback,
    // increment seconds using a functional
    // state update.
    console.log('Timer setup');
    const timerId = setInterval(() => {
      setSeconds(prevSecs => prevSecs + 1);
    }, 1000);

    return () => {
      // TODO 3:
      // Stop the interval using timerId.
      console.log('Timer cleanup');
      clearInterval(timerId);
    };
  }, []);

  return (
    <section>
      <h2>Effect Cleanup Practice</h2>

      {/* TODO 4:
          Display the number of elapsed seconds.
      */}
      <p>Elapsed time: {seconds} seconds</p>
    </section>
  );
}

export default CleanupPractice;
