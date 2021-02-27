import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as recipeApi from "src/services/recipeApi";
import { IRecipe } from "src/types/recipe";

interface IRecipeContext {
    loading: boolean,
    isEmpty: boolean,
    recipes: IRecipe[],
    page: number,
    ingredients: string,
    setPage: (page: number) => void,
    setIngredients: (ingredients: string) => void,
};

interface ProviderProps {
    children: React.ReactNode
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
                toast.error(error.response.data.message, {
                    position: "bottom-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                });
            } finally {
                setLoading(false);
            }
        }
        getRecipes();
    }, [page, ingredients]);

    const isEmpty = !loading && recipes.length === 0;

    return (
        <RecipeContext.Provider value={{
            loading,
            isEmpty,
            recipes,
            page,
            ingredients,
            setPage,
            setIngredients,
        }}>
            {children}
        </RecipeContext.Provider>
    );
}