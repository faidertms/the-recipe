import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { IRecipe } from 'src/types/recipe';

export interface GetRecipesResponse {
    recipes: IRecipe[],
    keywords: string[],
    message: string,
    code: string,
}

export interface GetRecipesRequest {
    ingredients: string,
    page?: number,
    query?: String
}

export const recipeApi: AxiosInstance = axios.create({
    baseURL: process.env.BASE_URL ?? "127.0.0.1:8000",
    timeout: 240000,
    headers:
    {
        'Content-Type': 'application/json'
    },
});

export const getRecipes = async ({ ingredients, page, query }: GetRecipesRequest): Promise<AxiosResponse<GetRecipesResponse>> => {
    const response = await recipeApi.get<GetRecipesResponse>('/recipes', {
        params: {
            i: ingredients,
            q: query,
            p: page,
        }
    });
    return response;
};

