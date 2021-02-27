
import './styles.css';
import RecipeItem from './RecipeItem';
import { RecipeContext } from '../../../contexts/Recipe';
import { useContext } from 'react';

export default function RecipeGrid(): JSX.Element {

    const { recipes } = useContext(RecipeContext);

    return (
        <div className="recipe-grid">
            {recipes.map(recipe => (
                <RecipeItem {...recipe} key={recipe.title} />
            ))}
        </div>
    )
} 