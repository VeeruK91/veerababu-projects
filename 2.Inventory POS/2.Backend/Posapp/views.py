from django.views.decorators.csrf import csrf_exempt
from django.contrib import messages
from django.conf import settings
import pymysql
from rest_framework.response import Response
from rest_framework.decorators import api_view
import os
def get_db_connection():
    """Reusable MySQL connection (always returns DictCursor)"""
    return pymysql.connect(
        host='127.0.0.1',
        port=3306,
        user='root',
        password='root',
        database='webdb3',
        cursorclass=pymysql.cursors.DictCursor  
    )


def ensure_single_admin():
    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()

            cur.execute("SELECT id FROM staff_table WHERE username='admin'")
            admin = cur.fetchone()

            if admin:
                cur.execute("UPDATE staff_table SET approved=1 WHERE username='admin'")
                con.commit()
            else:
                cur.execute("""
                    INSERT INTO staff_table
                    (username, email, password, mobile, address, approved)
                    VALUES (%s, %s, %s, %s, %s, 1)
                """, ("admin","admin@gmail.com","admin","1234567890","hyderabad"))
                con.commit()

    except Exception as e:
        print("admin creation error:", e)




@api_view(["POST"])
def approve_staff_api(request):
    username = request.data.get("username")
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("UPDATE staff_table SET approved=1 WHERE username=%s", (username,))
        con.commit()
    return Response({"success": "staff approved"})



@api_view(["GET"])
def user_page_api(request):
    username = request.GET.get("username")

    if not username:
        return Response({"error": "Username required"})

    return Response({"success": "User page loaded", "username": username})



@api_view(["POST"])
def approve_user_api(request):
    username = request.data.get("username")
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("UPDATE users_table SET approved=1 WHERE username=%s", (username,))
        con.commit()
    return Response({"success": "User approved"})



@api_view(["GET"])
def admin_page_api(request):
    try:
        con = get_db_connection()
        with con:
            cur = con.cursor(pymysql.cursors.DictCursor)

            
            cur.execute("SELECT * FROM users_table WHERE approved=0")
            users = cur.fetchall()

            
            cur.execute("SELECT * FROM staff_table WHERE approved=0")
            staffs = cur.fetchall()

        return Response({
            "users": users,
            "staff": staff
        })

    except Exception as e:
        return Response({"error": str(e)})


@api_view(["GET"])
def admin_users_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("SELECT * FROM users_table")
        return Response({"users": cur.fetchall()})

@api_view(["GET"])
def admin_staff_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("SELECT * FROM staff_table")
        return Response({"staff": cur.fetchall()})



@api_view(["POST"])
def register_api(request):
    username = request.data.get("username")
    email = request.data.get("email")
    password = request.data.get("password")
    confirm = request.data.get("confirm_password")
    mobile = request.data.get("mobile")
    address = request.data.get("address")
    role = request.data.get("role")  

    if password != confirm:
        return Response({"error": "Passwords do not match"})

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()

            
            table = "users_table" if role == "user" else "staff_table"

            
            cur.execute(f"SELECT username FROM {table} WHERE username=%s", (username,))
            if cur.fetchone():
                return Response({"error": "Username already exists"})

            cur.execute(f"SELECT email FROM {table} WHERE email=%s", (email,))
            if cur.fetchone():
                return Response({"error": "Email already exists"})

            cur.execute(f"SELECT mobile FROM {table} WHERE mobile=%s", (mobile,))
            if cur.fetchone():
                return Response({"error": "Mobile already exists"})

            
            cur.execute(f"""
                INSERT INTO {table}
                (username, email, password, mobile, address, approved)
                VALUES (%s, %s, %s, %s, %s, 0)
            """, (username, email, password, mobile, address))

            con.commit()

        return Response({"success": f"{role} account created. Awaiting Admin approval"})

    except Exception as e:
        return Response({"error": "Database error: " + str(e)})



@api_view(["POST"])
def login_api(request):
    ensure_single_admin()
    username = request.data.get("username")
    password = request.data.get("password")

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor(pymysql.cursors.DictCursor)

            
            if username == "admin" and password == "admin":
                return Response({
                    "success": "Login successful",
                    "role": "admin",
                    "username": username
                })

            
            cur.execute(
                "SELECT * FROM users_table WHERE username=%s AND password=%s",
                (username, password)
            )
            user = cur.fetchone()

            if user:
                if user["approved"] == 0:
                    return Response({"error": "User account not approved"})
                return Response({"success": "Login successful", "role": "user", "username": username})

            
            cur.execute(
                "SELECT * FROM staff_table WHERE username=%s AND password=%s",
                (username, password)
            )
            staff = cur.fetchone()

            if staff:
                if staff["approved"] == 0:
                    return Response({"error": "staff account not approved"})
                return Response({"success": "Login successful", "role": "staff", "username": username})

            return Response({"error": "Invalid login credentials"})

    except Exception as e:
        return Response({"error": str(e)})



@api_view(["GET"])
def user_details_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("SELECT * FROM users_table WHERE username=%s", (username,))
        user = cur.fetchone()
        if user:
            return Response({"user": user})

    return Response({"error": "User not found"})

@api_view(["GET"])
def staff_details_api(request):
    username = request.GET.get("username")
    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("SELECT * FROM staff_table WHERE username=%s", (username,))
        staff = cur.fetchone()
        if staff:
            return Response({"staff": staff})

    return Response({"error": "staff not found"})
 

# admin add products 
@api_view(["POST"])
def add_product_api(request):
    name = request.data.get("name")
    price = request.data.get("price")
    stock = request.data.get("stock")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            INSERT INTO products (name, price, stock)
            VALUES (%s, %s, %s)
        """, (name, price, stock))
        con.commit()

    return Response({"success": "Product added"})


# see all products
@api_view(["GET"])
def products_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("SELECT * FROM products")
        items = cur.fetchall()

    return Response({"products": items})


#adminupdate products
@api_view(["POST"])
def update_product_api(request):
    id = request.data.get("id")
    name = request.data.get("name")
    price = request.data.get("price")
    stock = request.data.get("stock")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            UPDATE products 
            SET name=%s, price=%s, stock=%s 
            WHERE id=%s
        """, (name, price, stock, id))
        con.commit()

    return Response({"success": "Product updated"})


# admin delete product
@api_view(["POST"])
def delete_product_api(request):
    id = request.data.get("id")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("DELETE FROM products WHERE id=%s", (id,))
        con.commit()

    return Response({"success": "Product deleted"})


# view all sales made by staff 
@api_view(["GET"])
def all_sales_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            SELECT s.id, s.staff_username,
                p.name AS product_name, s.quantity, s.total_price, s.sale_date
            FROM sales s
            JOIN products p ON p.id = s.product_id
            WHERE s.staff_username IS NOT NULL
            """)
        sales = cur.fetchall()

    return Response({"sales": sales})

# staff sell products 
@api_view(["POST"])
def sell_product_api(request):
    staff = request.data.get("staff")         
    user = request.data.get("user")            
    product_id = request.data.get("product_id")
    qty = int(request.data.get("quantity"))

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)

        
        cur.execute("SELECT * FROM products WHERE id=%s", (product_id,))
        product = cur.fetchone()

        if not product:
            return Response({"error": "Product not found"})

        
        if product["stock"] < qty:
            return Response({"error": "Not enough stock"})

        
        new_stock = product["stock"] - qty
        cur.execute("UPDATE products SET stock=%s WHERE id=%s",
                    (new_stock, product_id))

       
        total_price = float(product["price"]) * qty

        
        cur.execute("""
            INSERT INTO sales (staff_username, user_username, product_id, quantity, total_price)
            VALUES (%s, %s, %s, %s, %s)
        """, (staff, user, product_id, qty, total_price))

        con.commit()

    return Response({
        "success": "Sale completed",
        "total_price": total_price
    })

# staff see their won slaes
@api_view(["GET"])
def staff_sales_api(request):
    staff = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("""
            SELECT s.id, s.product_id, p.name AS product_name, 
                   s.quantity, s.total_price, s.sale_date, s.user_username    
            FROM sales s
            JOIN products p ON p.id = s.product_id
            WHERE s.staff_username=%s
            ORDER BY s.sale_date DESC
        """, (staff,))
        data = cur.fetchall()

    return Response({"sales": data})


# user purchase history
@api_view(["GET"])
def user_sales_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("""
            SELECT s.id, p.name AS product_name, 
                   s.quantity, s.total_price, s.sale_date
            FROM sales s
            JOIN products p ON p.id = s.product_id
            WHERE s.user_username=%s
            ORDER BY s.sale_date DESC
        """, (username,))
        data = cur.fetchall()

    return Response({"sales": data})
