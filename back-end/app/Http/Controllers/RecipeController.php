<?php

namespace App\Http\Controllers;

use App\Services\RecipeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class RecipeController extends Controller
{
    private RecipeService $recipeService;

    public function __construct(RecipeService $recipeService)
    {
        $this->recipeService = $recipeService;
    }

    public function index(Request $request)
    {
        try {

            Validator::make([
                'i'   => $request->i,
                'p'   => $request->p,
                'q'   => $request->q
            ], [
                'i'   => 'nullable|string',
                'p'   => 'nullable|integer|min:1',
                'q'   => 'nullable|string'
            ])->validate();

            $ingredients = $request->i ? explode(',', $request->i) : [];
            sort($ingredients, SORT_STRING);

            $responseBody = [
                'recipes'   => $this->recipeService->getRecipesWithImageByIngredients($ingredients, $request->p, $request->q),
                'keywords'  => $ingredients
            ];

            return $this->sendResponse("successful", $responseBody, 200);
        } catch (\Throwable $throwable) {
            return $this->sendErrorResponse($throwable);
        }
    }
}
