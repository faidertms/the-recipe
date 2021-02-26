<?php

namespace App\Http\Controllers;

use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function makeBasicResponse(string $message, string $code, array $data = [])
    {
        return array_merge($data, ["message" => $message, "code" => $code]);
    }

    public function sendResponse(string $message, array $data = null, int $httpCode = 200)
    {
        $responseData = $this->makeBasicResponse($message, $httpCode, $data);
        return response()->json($responseData, $httpCode);
    }

    public function sendErrorResponse(\Throwable $throwable, array $data = null, int $httpCode = 500)
    {
        report($throwable);
        $message = $throwable->getMessage();
        $code = $throwable->getCode();
        $errorInstance = get_class($throwable);
        $data = $data ?? [];

        switch ($errorInstance) {
            case 'Illuminate\Validation\ValidationException':
                $data = [
                    'errors' => $throwable->validator->errors()
                ];
                $httpCode = $throwable->status;
                $code = $throwable->status;
                break;
            case 'App\Exceptions\ServiceUnavailableException':
                $httpCode = $throwable->getCode();
                $code = $throwable->getCode();
            default:
                break;
        }

        $responseData = $this->makeBasicResponse($message, $code, $data);
        return response()->json($responseData, $httpCode);
    }
}
