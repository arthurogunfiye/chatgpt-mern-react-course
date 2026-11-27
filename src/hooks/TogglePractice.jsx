import useToggle from './useToggle';

function TogglePractice() {
  // TODO 1:
  // Call useToggle(false).
  // Destructure isOpen and toggle.
  const { isOpen, toggle } = useToggle();

  return (
    <section>
      <h2>Toggle Practice</h2>

      {/* TODO 2:
          Display "Open" if isOpen is true,
          otherwise display "Closed".
      */}
      {isOpen ? <p>Open</p> : <p>Closed</p>}

      {/* TODO 3:
          Create a button that calls toggle
          when clicked.
      */}
      <button type='button' onClick={toggle}>
        Toggle
      </button>
    </section>
  );
}

export default TogglePractice;
