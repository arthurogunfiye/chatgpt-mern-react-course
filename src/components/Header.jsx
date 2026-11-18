import Nav from './Nav';
import Welcome from './Welcome';

const Header = ({ cartCount, onResetCart }) => {
  return (
    <header>
      <Nav cartCount={cartCount} onResetCart={onResetCart} />
      <Welcome />
    </header>
  );
};
export default Header;
