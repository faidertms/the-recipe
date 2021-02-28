import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as recipeApi from "src/services/recipeApi";
import { IRecipe } from "src/types/recipe";

interface IRecipeContext {
    loading: boolean,
    isEmpty: boolean,
    isLastPage: boolean,
    isFirstPage: boolean,
    recipes: IRecipe[],
    page: number,
    limit: number,
    ingredients: string,
    setPage: (page: number) => void,
    nextPage: () => void,
    previousPage: () => void,
    setIngredients: (ingredients: string) => void,
    searchForRecipes: (ingredients: string) => void,
};

interface ProviderProps {
    children: React.ReactNode
};

export const RecipeContext = createContext<IRecipeContext>({} as IRecipeContext);

export const RecipeContextProvider = ({ children }: ProviderProps): JSX.Element => {
    const [recipes, setRecipes] = useState<IRecipe[]>([]);
    const [page, setPage] = useState<number>(1);
    const [lastPage, setLastPage] = useState<number>(-1); // we don't know which is the last page so i will start with -1
    const [ingredients, setIngredients] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const limit = 10;

    useEffect(() => {
        const getRecipes = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await recipeApi.getRecipes({ page, ingredients });
                const isLastPage = response.data.recipes.length < limit;
                const haveNewRecipes = response.data.recipes.length > 0;
                setRecipes(response.data.recipes);
                if (isLastPage) {
                    //if dont have new recipes but the state page is beyond of limit page, we need return to previous page.
                    const newLastPage = haveNewRecipes ? page : page - 1;
                    setLastPage(newLastPage);
                    if (!haveNewRecipes)
                        setPage(newLastPage);
                }
            } catch (error) {
                const message: string = error.response ? error.response.data.message : "Server Offline";
                toast.error(message, {
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


    const nextPage = () => {
        if (!isLastPage)
            setPage(prevState => prevState + 1);
    }

    const previousPage = () => {
        if (!isFirstPage)
            setPage(prevState => prevState - 1);
    }

    const searchForRecipes = (ingredients: string) => {
        setIngredients(ingredients);
        setPage(1);
        setLastPage(-1);
    }

    const isFirstPage = page === 1;
    const isEmpty = !loading && recipes.length === 0 && !isFirstPage;
    const isLastPage = isEmpty || lastPage === page;

    return (
        <RecipeContext.Provider value={{
            loading,
            isEmpty,
            isLastPage,
            isFirstPage,
            recipes,
            page,
            ingredients,
            limit,
            setPage,
            nextPage,
            previousPage,
            setIngredients,
            searchForRecipes,
        }}>
            {children}
        </RecipeContext.Provider>
    );
}