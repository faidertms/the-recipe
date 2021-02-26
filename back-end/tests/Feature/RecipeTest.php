<?php

namespace Tests\Feature;

use Tests\TestCase;

class RecipeTest extends TestCase
{
    /**
     * test recipe index endpoint.
     *
     * @return void
     */
    public function testValidationRequest()
    {
        //Page validation
        $this->json('GET', '/recipes?i=butter&p=0', ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'code',
                'errors' => [
                    'p'
                ]
            ]);

        //Ingredients validation
        $this->json('GET', '/recipes', ['Accept' => 'application/json'])
            ->assertStatus(422)
            ->assertJsonStructure([
                'message',
                'code',
                'errors' => [
                    'i'
                ]
            ]);
    }

    public function testSuccessfulRequest()
    {
        $this->json('GET', '/recipes?i=butter,chicken broth,onions', ['Accept' => 'application/json'])
            ->assertJsonStructure([
                'message',
                'code',
                'keywords',
                'recipes' => [
                    '*' => [
                        'title',
                        'ingredients',
                        'link',
                        'gif'
                    ]
                ]
            ]);
    }
}
