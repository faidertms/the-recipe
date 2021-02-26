<?php

namespace App\Services;

use Illuminate\Support\Facades\Validator;
use App\Api\{
    Giphy,
    RecipePuppy
};

class RecipeService
{
    public function getRecipesWithImageByIngredients(array $ingredients = [], ?int $page = 1, ?string $query = ''): array
    {
        $page = $page ?? 1;
        $query = $query ?? '';
        sort($ingredients, SORT_STRING);

        Validator::make([
            'ingredients'   => $ingredients,
            'page'          => $page,
            'query'         => $query
        ], [
            'ingredients'   => 'array|max:3',
            'page'          => 'nullable|integer|min:1',
            'query'         => 'nullable|string'
        ])->validate();

        $recipes = RecipePuppy::getRecipesByIngredients($ingredients, $page, $query);
        $recipesWithImage = array_map(function ($recipe) {
            $gifs = Giphy::getGifsBySearchQuery($recipe['title']);
            return array(
                'title'         => $recipe['title'],
                'ingredients'   => $recipe['ingredients'],
                'link'          => $recipe['href'],
                'gif'           => empty($gifs['data']) ? null : $gifs['data'][0]['images']['fixed_height']['url']
            );
        }, $recipes);

        return $recipesWithImage;
    }
}
