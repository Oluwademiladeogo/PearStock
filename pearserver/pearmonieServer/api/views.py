from django.contrib.auth import authenticate, get_user_model
from django.contrib.auth.models import User
from django.http import HttpResponse
from pearmonieServer.models import Products
from rest_framework import status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response

from .serializers import ProductSerializer, UserSerializer
from .swagger_docs import (
    dashboard_docs,
    forgot_password_docs,
    home_docs,
    login_docs,
    logout_docs,
    product_list_docs,
    signup_docs,
    verify_otp_docs,
)

User = get_user_model()


@api_view(["POST"])
@permission_classes([AllowAny])
@login_docs
def login(request):
    email = request.data.get("email")
    password = request.data.get("password")
    user = authenticate(email=email, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key, "user": UserSerializer(user).data})
    else:
        try:
            User.objects.get(email=email)
            return Response(
                {"error": "Incorrect password"}, status=status.HTTP_401_UNAUTHORIZED
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found"}, status=status.HTTP_401_UNAUTHORIZED
            )


@api_view(["POST"])
@permission_classes([AllowAny])
@signup_docs
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response(
            {"token": token.key, "user": serializer.data},
            status=status.HTTP_201_CREATED,
        )
    else:
        errors = {field: errors[0] for field, errors in serializer.errors.items()}
        return Response({"errors": errors}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([AllowAny])
@forgot_password_docs
def forgot_password(request):
    email = request.data.get("email")
    try:
        user = User.objects.get(email=email)
        # Implement Reset Logic here
        return Response({"message": "Reset email sent"})
    except User.DoesNotExist:
        return Response(
            {"error": "User with provided email does not exist"},
            status=status.HTTP_404_NOT_FOUND,
        )


@api_view(["POST"])
@permission_classes([AllowAny])
@verify_otp_docs
def verify_otp(request):
    otp = request.data.get("otp")
    valid_otp = True
    if valid_otp:
        return Response({"message": "OTP verified"})
    else:
        return Response({"error": "Invalid OTP"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
@logout_docs
def logout(request):
    try:
        request.user.auth_token.delete()
        return Response(
            {"message": "Successfully logged out"}, status=status.HTTP_200_OK
        )
    except AttributeError:
        return Response({"error": "No token found"}, status=status.HTTP_400_BAD_REQUEST)


@api_view(["GET"])
@permission_classes([IsAuthenticated])
@dashboard_docs
def dashboard(request):
    total_products = Products.objects.count()
    low_stock_items = Products.objects.filter(stock__lt=10).count()

    dashboard_data = [
        {
            "title": "Total Products",
            "description": str(total_products),
        },
        {
            "title": "Low Stock Items",
            "description": str(low_stock_items),
        },
    ]

    return Response(dashboard_data)


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = None  # Disable pagination

    @product_list_docs
    def get_queryset(self):
        queryset = Products.objects.all()
        search = self.request.query_params.get("search", None)
        type_filter = self.request.query_params.get("type", None)
        store_filter = self.request.query_params.get("store", None)

        if search:
            queryset = queryset.filter(name__icontains=search)
        if type_filter:
            queryset = queryset.filter(type=type_filter)
        if store_filter:
            queryset = queryset.filter(store=store_filter)

        return queryset

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = request.user
            serializer.save(user=user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop("partial", False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        if serializer.is_valid():
            serializer.save()  # Save the updated product
            return Response(serializer.data)
        else:
            return Response(
                {"errors": serializer.errors}, status=status.HTTP_400_BAD_REQUEST
            )

    def destroy(self, request, *args, **kwargs):
        try:
            instance = self.get_object()
            self.perform_destroy(instance)
            return Response(status=status.HTTP_204_NO_CONTENT)
        except Exception as e:
            return Response(
                {"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )


@api_view(["GET"])
@permission_classes([AllowAny])
@home_docs
def home(request):
    """Check if user is authenticated based on token in header"""
    auth_header = request.META.get("HTTP_AUTHORIZATION", "")
    if auth_header.startswith("Token "):
        token_key = auth_header.split(" ")[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            return Response(
                {
                    "authenticated": True,
                    "token": token_key,
                    "user": UserSerializer(user).data,
                }
            )
        except Token.DoesNotExist:
            pass

    return Response({"authenticated": False})


@api_view(["GET"])
@permission_classes([AllowAny])
def health_check(request):
    """
    Simple endpoint to verify that the API is functioning correctly.
    Returns a 200 OK response if the server is healthy.
    """
    return HttpResponse("OK", status=status.HTTP_200_OK)
