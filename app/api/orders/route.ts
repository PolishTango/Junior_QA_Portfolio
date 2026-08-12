import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';

const sanitizeItems = (items: any[]) => {
  if (!Array.isArray(items)) return [];
  return items.map((item: any) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    quantity: item.quantity,
  }));
};

export async function GET() {
  try {
    const { data, error } = await supabase.from('orders').select('*');

    if (error) {
      console.error('Error fetching orders from Supabase:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedOrders = data.map((order) => {
      let formattedBoughtAt = order.created_at;
      if (order.created_at) {
        const date = new Date(order.created_at);
        formattedBoughtAt = date.toISOString().replace('T', ' ').substring(0, 19);
      }

      const cleanedItems = order.items ? order.items.map((item: any) => {
        return {
          name: item.name,
          price: typeof item.price === 'string' && item.price.includes('zł') ? item.price : `${item.price}zł`,
          quantity: item.quantity
        };
      }) : [];

      return {
        id: order.id,
        first_name: order.first_name,
        last_name: order.last_name,
        address: order.address,
        total_price: typeof order.total_price === 'string' && order.total_price.includes('zł') ? order.total_price : `${order.total_price}zł`,
        bought_at: formattedBoughtAt,
        items: cleanedItems
      };
    });

    return NextResponse.json(formattedOrders, { status: 200 });
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json({ error: 'An internal server error occurred.' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const firstName = body.firstName || body.first_name || body.firstname;
    const lastName = body.lastName || body.last_name;
    const address = body.address;
    const totalPrice = body.totalPrice || body.total_price;
    const items = body.items || [];

    const expectedTotal = parseFloat(String(totalPrice).replace(/[^0-9.]/g, ""));
    
    const calculatedTotal = items.reduce((sum: number, item: any) => {
      const itemPrice = parseFloat(String(item.price).replace(/[^0-9.]/g, ""));
      const itemQuantity = Number(item.quantity) || 1;
      return sum + (itemPrice * itemQuantity);
}, 0);

    if (isNaN(expectedTotal) || calculatedTotal !== expectedTotal) {
      return NextResponse.json(
        { 
          error: `Validation failed: Total price (${expectedTotal}) does not match items sum (${calculatedTotal}). Order was not saved.` 
        }, 
        { status: 400 }
      );
    }

    const cleanedItems = sanitizeItems(items);

    const { data, error } = await supabase
      .from('orders')
      .insert([
        {
          first_name: firstName,
          last_name: lastName,
          address: address,
          total_price: expectedTotal,
          items: cleanedItems,
        },
      ])
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Your order was placed successfully!', order: data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { error: 'An error occurred while processing your order.' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required for update.' }, { status: 400 });
    }

    const firstName = body.firstName || body.first_name || body.firstname;
    const lastName = body.lastName || body.last_name;
    const address = body.address;
    const totalPrice = body.totalPrice || body.total_price;
    const cleanedItems = sanitizeItems(body.items);

    const { data, error } = await supabase
      .from('orders')
      .update({
        first_name: firstName,
        last_name: lastName,
        address: address,
        total_price: totalPrice,
        items: cleanedItems,
      })
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Order updated successfully!', order: data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { error: 'An error occurred while updating the order.' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required for partial update.' }, { status: 400 });
    }

    const dbUpdates: any = {};
    const fName = updates.firstName || updates.first_name || updates.firstname;
    const lName = updates.lastName || updates.last_name;
    const tPrice = updates.totalPrice || updates.total_price;

    if (fName !== undefined) dbUpdates.first_name = fName;
    if (lName !== undefined) dbUpdates.last_name = lName;
    if (updates.address !== undefined) dbUpdates.address = updates.address;
    if (tPrice !== undefined) dbUpdates.total_price = tPrice;
    
    if (updates.items !== undefined) {
      dbUpdates.items = sanitizeItems(updates.items);
    }

    const { data, error } = await supabase
      .from('orders')
      .update(dbUpdates)
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: 'Order partially updated successfully!', order: data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { error: 'An error occurred while partially updating the order.' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Order ID is required as a query parameter (e.g., ?id=1).' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      .select();

    if (error) {
      console.error('Supabase Error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: `Order with ID ${id} deleted successfully!`, order: data },
      { status: 200 }
    );
  } catch (err) {
    console.error('Server Error:', err);
    return NextResponse.json(
      { error: 'An error occurred while deleting the order.' },
      { status: 500 }
    );
  }
}