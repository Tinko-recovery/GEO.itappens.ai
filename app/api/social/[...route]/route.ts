import { NextResponse } from 'next/server';

const FLASK_URL = process.env.SOCIAL_ENGINE_URL || 'http://localhost:8080';

export async function GET(request: Request, props: { params: Promise<{ route: string[] }> }) {
  const params = await props.params;
  const route = params.route.join('/');
  const searchParams = new URL(request.url).searchParams.toString();
  const url = `${FLASK_URL}/api/${route}${searchParams ? '?' + searchParams : ''}`;

  try {
    const response = await fetch(url, {
      headers: { 'Content-Type': 'application/json' },
      cache: 'no-store',
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[Social Proxy GET Error] ${route}:`, error);
    return NextResponse.json({ error: 'Social Engine is offline' }, { status: 503 });
  }
}

export async function POST(request: Request, props: { params: Promise<{ route: string[] }> }) {
  const params = await props.params;
  const route = params.route.join('/');
  const url = `${FLASK_URL}/api/${route}`;
  
  let body = {};
  try {
    body = await request.json();
  } catch (e) {
    // Handle empty body if necessary
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const data = await response.json();
    return NextResponse.json(data, { status: response.status });
  } catch (error) {
    console.error(`[Social Proxy POST Error] ${route}:`, error);
    return NextResponse.json({ error: 'Social Engine is offline' }, { status: 503 });
  }
}
