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
        database='webdb2',
        cursorclass=pymysql.cursors.DictCursor  
    )


def ensure_single_admin():
    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()

            cur.execute("SELECT id FROM providers_table WHERE username='admin'")
            admin = cur.fetchone()

            if admin:
                cur.execute("UPDATE providers_table SET approved=1 WHERE username='admin'")
                con.commit()
            else:
                cur.execute("""
                    INSERT INTO providers_table
                    (username, email, password, mobile, address, approved)
                    VALUES (%s, %s, %s, %s, %s, 1)
                """, ("admin","admin@gmail.com","admin","1234567890","hyderabad"))
                con.commit()

    except Exception as e:
        print("Admin creation error:", e)




@api_view(["POST"])
def approve_provider_api(request):
    username = request.data.get("username")
    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("UPDATE providers_table SET approved=1 WHERE username=%s", (username,))
        con.commit()
    return Response({"success": "Provider approved"})



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

            
            cur.execute("SELECT * FROM providers_table WHERE approved=0")
            providers = cur.fetchall()

        return Response({
            "users": users,
            "providers": providers
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
def admin_providers_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("SELECT * FROM providers_table")
        return Response({"providers": cur.fetchall()})





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

           
            cur.execute("SELECT * FROM blocked_providers WHERE email=%s OR mobile=%s", (email, mobile))
            if cur.fetchone():
                return Response({"error": "This account was removed earlier. You cannot register again."})


            
            table = "users_table" if role == "user" else "providers_table"

            
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

        return Response({"success": f"{role} account created. Awaiting admin approval"})

    except Exception as e:
        return Response({"error": "Database error: " + str(e)})



@api_view(["POST"])
def login_api(request):
    ensure_single_admin()

    username = request.data.get("username")
    password = request.data.get("password")

    
    if username == "admin" and password == "admin":
        return Response({
            "success": "Login successful",
            "role": "admin",
            "username": username
        })

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor(pymysql.cursors.DictCursor)

            
            cur.execute("""
                SELECT * FROM blocked_providers
                WHERE username=%s OR email=%s OR mobile=%s
            """, (username, username, username))

            if cur.fetchone():
                return Response({
                    "error": "Your account was removed due to low ratings. You cannot login again."
                })

            
            cur.execute(
                "SELECT * FROM users_table WHERE username=%s AND password=%s",
                (username, password)
            )
            user = cur.fetchone()

            if user:
                if user["approved"] == 0:
                    return Response({"error": "User account not approved"})
                return Response({
                    "success": "Login successful",
                    "role": "user",
                    "username": username
                })

           
            cur.execute(
                "SELECT * FROM providers_table WHERE username=%s AND password=%s",
                (username, password)
            )
            provider = cur.fetchone()

            if provider:
                if provider["approved"] == 0:
                    return Response({"error": "Provider account not approved"})
                return Response({
                    "success": "Login successful",
                    "role": "serviceprovider",
                    "username": username
                })

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
def provider_details_api(request):
    username = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("SELECT * FROM providers_table WHERE username=%s", (username,))
        provider = cur.fetchone()
        if provider:
            return Response({"provider": provider})

    return Response({"error": "Provider not found"})
 
 
@api_view(["POST"])
def add_service_api(request):
    provider = request.data.get("provider")
    name = request.data.get("service_name")
    price = request.data.get("price")
    desc = request.data.get("description")

    try:
        con = get_db_connection()
        with con:
            cur = con.cursor()
            cur.execute("""
                INSERT INTO provider_services (provider_username, service_name, price, description)
                VALUES (%s, %s, %s, %s)
            """, (provider, name, price, desc))

            con.commit()
        return Response({"success": "Service Added Successfully"})

    except Exception as e:
        return Response({"error": str(e)})



@api_view(["GET"])
def all_services_api(request):
    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("""
            SELECT p.username, s.service_name, s.price, s.description
            FROM provider_services s
            JOIN providers_table p ON p.username=s.provider_username
            WHERE p.approved=1
        """)
        data = cur.fetchall()

    return Response({"services": data})


@api_view(["POST"])
def book_service_api(request):
    user = request.data.get("user")
    provider = request.data.get("provider")
    service = request.data.get("service_name")
    price = request.data.get("price")

    con = get_db_connection()
    with con:
        cur = con.cursor()
        cur.execute("""
            INSERT INTO bookings(user_username, provider_username, service_name, price)
            VALUES(%s, %s, %s, %s)
        """, (user, provider, service, price))

        con.commit()

    return Response({"success": "Service booked successfully!"})


@api_view(["POST"])
def rating_api(request):
    provider = request.data.get("provider")
    user = request.data.get("user")
    rating = int(request.data.get("rating"))
    feedback = request.data.get("feedback")

    con = get_db_connection()
    with con:
        cur = con.cursor()

        
        cur.execute("""
            INSERT INTO ratings(provider_username, user_username, rating, feedback)
            VALUES (%s, %s, %s, %s)
        """, (provider, user, rating, feedback))

        
        cur.execute("""
            SELECT COUNT(*) AS bad_count 
            FROM ratings 
            WHERE provider_username=%s AND rating < 3
        """, (provider,))
        bad = cur.fetchone()["bad_count"]

        
        if bad >= 5:
            
            cur.execute("SELECT * FROM providers_table WHERE username=%s", (provider,))
            p = cur.fetchone()

            
            cur.execute("""
                INSERT INTO blocked_providers(username, email, mobile, reason)
                VALUES (%s, %s, %s, %s)
            """, (p["username"], p["email"], p["mobile"], "Too many bad ratings"))

            
            cur.execute("DELETE FROM providers_table WHERE username=%s", (provider,))

            
            cur.execute("DELETE FROM provider_services WHERE provider_username=%s", (provider,))

            con.commit()

            return Response({
                "removed": True,
                "message": "Provider removed permanently due to low ratings"
            })

        con.commit()

    return Response({"success": "Rating submitted!"})


@api_view(["GET"])
def provider_bookings_api(request):
    provider = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)
        cur.execute("""
            SELECT user_username, service_name, price
            FROM bookings
            WHERE provider_username=%s
        """, (provider,))
        data = cur.fetchall()

    return Response({"bookings": data})


@api_view(["GET"])
def provider_ratings_api(request):
    provider = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)

        cur.execute("""
            SELECT user_username, rating, feedback
            FROM ratings
            WHERE provider_username=%s
        """, (provider,))

        ratings = cur.fetchall()

    return Response({"ratings": ratings})


@api_view(["GET"])
def user_booked_providers_api(request):
    user = request.GET.get("username")

    con = get_db_connection()
    with con:
        cur = con.cursor(pymysql.cursors.DictCursor)

        cur.execute("""
            SELECT DISTINCT provider_username 
            FROM bookings 
            WHERE user_username=%s
        """, (user,))

        data = cur.fetchall()

    return Response({"booked": data})
