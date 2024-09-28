function Meal({ meal }) {
  return (
    <div>
      <p>
        <strong>Title:</strong> {meal.title}
      </p>
      <p>
        <strong>Description:</strong> {meal.description}
      </p>
      <p>
        <strong>Price:</strong> ${meal.price}
      </p>
    </div>
  );
}

export default Meal;
