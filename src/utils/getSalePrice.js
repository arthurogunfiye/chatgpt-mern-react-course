export default function getSalePrice(product) {
  const { price, onSale, discount } = product;

  if (!onSale || !discount) return price;

  const discounted = price * (1 - discount / 100);

  return Math.round(discounted * 100) / 100;
}
