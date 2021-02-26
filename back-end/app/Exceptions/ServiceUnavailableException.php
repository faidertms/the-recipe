<?php

namespace App\Exceptions;

use Exception;

class ServiceUnavailableException extends Exception
{
    public function __construct(string $message = null)
    {
        $message = $message ?? 'Service Unavailable';
        parent::__construct($message, 503);
    }
}
