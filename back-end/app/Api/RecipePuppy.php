<?php

namespace App\Api;

use App\Exceptions\ServiceUnavailableException;
use Illuminate\Support\Facades\Http;

class RecipePuppy
{
    protected static function buildApiUrl(string $path): string
    {
        return 'http://www.recipepuppy.com/api' . $path;
    }

    public static function getRecipesByIngredients(array $ingredients, int $page = 1, string $query = ''): array
    {
        $url = self::buildApiUrl('/');

        $response = Http::withHeaders([
            'accept' => 'application/json'
        ])->get($url, [
            'i' => implode(',', $ingredients),
            'q' => $query,
            'p' => $page,
        ]);

        if ($response->failed()) {
            throw new ServiceUnavailableException("RecipePuppy unavailable. Try again later");
        }

        return $response['results'];
    }
}
