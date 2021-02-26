<?php

namespace App\Api;

use App\Exceptions\ServiceUnavailableException;
use Illuminate\Support\Facades\Http;

class Giphy
{

    protected static function buildApiUrl(string $path): string
    {
        return 'http://api.giphy.com/v1' . $path;
    }

    public static function getGifsBySearchQuery(string $query, int $limit = 1, int $offset = 0): array
    {
        $response = Http::get(self::buildApiUrl('/gifs/search'), [
            'api_key' => config('app.giphy_api_key'),
            'q'       => $query,
            'rating'  => 'g',
            'limit'   => $limit,
            'offset'  => $offset,
        ]);

        if ($response->failed()) {
            throw new ServiceUnavailableException("Giphy unavailable. Try again later");
        }

        return $response->json();
    }
}
