import { createContext, useEffect, useState } from "react";
import * as recipeApi from "src/services/recipeApi";
import { IRecipe } from "src/types/recipe";

interface IRecipeContext {
    loading: boolean,
    recipes: IRecipe[],
    page: number,
    ingredients: string,
    setPage: (page: number) => void,
    setIngredients: (ingredients: string) => void,
};

interface ProviderProps {
    children: JSX.Element
};

export const RecipeContext = createContext<IRecipeContext>({} as IRecipeContext);

export const RecipeContextProvider = ({ children }: ProviderProps): JSX.Element => {
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [page, setPage] = useState<number>(1);
    const [ingredients, setIngredients] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);

    useEffect(() => {
        const getRecipes = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await recipeApi.getRecipes({ page, ingredients });
                setRecipes(response.data.recipes);
            } catch (error) {
                //TODO - Type and Error handle
                console.log(error)
            } finally {
                setLoading(false);
            }
        }
        getRecipes();
    }, [page, ingredients]);

    return (
        <RecipeContext.Provider value={{
            recipes,
            loading,
            page,
            ingredients,
            setPage,
            setIngredients,
        }}>
            {children}
        </RecipeContext.Provider>
    );
}