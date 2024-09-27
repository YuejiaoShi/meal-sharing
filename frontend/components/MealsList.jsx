function MealsList() {
  const [meals, setMeals] = useState([]);

  useEffect(() => {
    fetch("http://localhost:3001/api/all-meals")
      .then((res) => res.json())
      .then((meals) => setMeals(meals));
  }, []);

  return (
    <div>
      {meals.map((meal) => (
        <p>{meal.title}</p>
      ))}
    </div>
  );
}

export default MealsList;
