
import { useContext, useState } from 'react';
import { RecipeContext } from 'src/contexts/Recipe';
import { FiSearch } from 'react-icons/fi';
import './styles.css';

export default function Header(): JSX.Element {
    const { searchForRecipes } = useContext(RecipeContext);
    const [search, setSearch] = useState('');

    const checkIfIngredientsIsValid = (ingredients: string) => {
        var regex = new RegExp('^(?!.* {2})[a-zA-Z0-9 _.-]+(?:,((?!.* {2})[a-zA-Z0-9 _.-]?)+){0,2}$');
        return ingredients === '' || regex.test(ingredients);
    }

    const submitIngredients = () => {
        const trimSearch = search.trim();
        setSearch(trimSearch);
        searchForRecipes(trimSearch);
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            submitIngredients();
        }
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (checkIfIngredientsIsValid(event.target.value)) {
            setSearch(event.target.value);
        }
    }

    return (
        <header className="header">
            <nav>
                <div className="logo">
                    <span>The Recipe</span>
                </div>
                <div className="search">
                    <input name="ingredients" value={search} onChange={onChange} onKeyDown={onKeyDown} placeholder="Enter ingredients (separated by commas)" />
                    <button className="center-items" onClick={submitIngredients}>
                        <FiSearch />
                    </button>
                </div>
                <div>
                    {/* empty div only to use space between */}
                </div>
            </nav>
        </header>
    );
}


