const Nav = ({ cartCount, onResetCart }) => {
  return (
    <div className='site-navigation'>
      <div className='mobile-header'>
        <a href='#top' className='logo'>
          MyStore
        </a>

        <details className='mobile-menu'>
          <summary>Menu</summary>

          <nav aria-label='Mobile navigation'>
            <ul>
              <li>
                <a href='#top'>Home</a>
              </li>
              <li>
                <a href='#products'>Products</a>
              </li>
              <li>
                <a href='#categories'>Categories</a>
              </li>
              <li>
                <a href='#specs'>Specifications</a>
              </li>
              <li>
                <a href='#comparison'>Comparison</a>
              </li>
              <li>
                <a href='#about'>About</a>
              </li>
              <li>
                <a href='#contact'>Contact</a>
              </li>
            </ul>
          </nav>
        </details>

        <div className='mobile-cart'>
          <span id='mobile-cart-count' role='status' aria-live='polite'>
            Cart: {cartCount}
          </span>
          <button type='button' className='reset-cart' onClick={onResetCart}>
            Reset Cart
          </button>
        </div>
      </div>

      <div className='desktop-navigation'>
        <nav id='main-nav' aria-label='Main navigation'>
          <a href='#top' className='logo'>
            MyStore
          </a>

          <ul>
            <li>
              <a href='#top'>Home</a>
            </li>
            <li>
              <a href='#products'>Products</a>
            </li>
            <li>
              <a href='#about'>About</a>
            </li>
            <li>
              <a href='#contact'>Contact</a>
            </li>
            <li>
              <span id='cart-count' role='status' aria-live='polite'>
                Cart: {cartCount}
              </span>
            </li>
            <li>
              <button
                type='button'
                className='reset-cart'
                onClick={onResetCart}
              >
                Reset Cart
              </button>
            </li>
          </ul>
        </nav>

        <nav id='secondary-nav' aria-label='Product navigation'>
          <ul>
            <li>
              <a href='#categories'>Product Categories</a>
            </li>
            <li>
              <a href='#products'>Products</a>
            </li>
            <li>
              <a href='#specs'>Product Specs</a>
            </li>
            <li>
              <a href='#comparison'>Product Comparison</a>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};
export default Nav;
