
import './styles.css';
import RecipeItem from './RecipeItem';
import { RecipeContext } from '../../../contexts/Recipe';
import { useContext } from 'react';
import RecipeItemLoader from './RecipeItemLoader';
import EmptyGrid from './EmptyGrid';

export default function RecipeGrid(): JSX.Element {

    const { recipes, loading, isEmpty } = useContext(RecipeContext);

    const recipesItems = loading ? Array(10).fill(undefined) : recipes;

    return isEmpty ? (
        <EmptyGrid />
    ) : (
        <div className="recipe-grid">
            {recipesItems.map((recipe, index) => (
                loading ? <RecipeItemLoader key={index} /> : <RecipeItem {...recipe} key={recipe.title} />
            ))}
        </div>
    );
} 