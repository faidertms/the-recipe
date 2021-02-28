
import './styles.css';
import RecipeItem from './RecipeItem';
import { RecipeContext } from '../../../contexts/Recipe';
import { Fragment, useContext } from 'react';
import RecipeItemLoader from './RecipeItemLoader';
import EmptyGrid from './EmptyGrid';
import Pagination from '../Pagination';

export default function RecipeGrid(): JSX.Element {

    const { recipes, loading, isEmpty } = useContext(RecipeContext);

    const recipesItems = loading ? Array(10).fill(undefined) : recipes;

    return isEmpty ? (
        <EmptyGrid />
    ) : (
            <Fragment>
                <div className="recipe-grid">
                    {recipesItems.map((recipe, index) => (
                        loading ? <RecipeItemLoader key={index} /> : <RecipeItem {...recipe} key={recipe.title} />
                    ))}
                </div>
                <Pagination />
            </Fragment>
        );
} 