<?php

namespace App\Http\Controllers;

use App\Models\Component;
use Illuminate\Http\Request;

class ComponentController extends Controller
{
    public function index()
    {
        // Retorna todos os componentes agrupados se o frontend quiser, ou lista plana
        $components = Component::all();
        return response()->json($components);
    }
}
