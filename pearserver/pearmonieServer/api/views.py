from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer, ProductSerializer
from pearmonieServer.models import Products
from .swagger_docs import (
    login_docs, signup_docs, forgot_password_docs, verify_otp_docs,
    logout_docs, dashboard_docs, product_list_docs, home_docs
)

@api_view(['POST'])
@permission_classes([AllowAny])
@login_docs
def login(request):
    email = request.data.get('email')
    password = request.data.get('password')
    user = authenticate(email=email, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': UserSerializer(user).data
        })
    return Response(
        {'error': 'Invalid credentials'}, 
        status=status.HTTP_401_UNAUTHORIZED
    )

@api_view(['POST'])
@permission_classes([AllowAny])
@signup_docs
def signup(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user': serializer.data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
@forgot_password_docs
def forgot_password(request):
    email = request.data.get('email')
    # Implement password reset logic here
    return Response({'message': 'Reset email sent'})

@api_view(['POST'])
@permission_classes([AllowAny])
@verify_otp_docs
def verify_otp(request):
    otp = request.data.get('otp')
    # Implement OTP verification logic here
    return Response({'message': 'OTP verified'})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@logout_docs
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})

@api_view(['GET'])
@permission_classes([IsAuthenticated])
@dashboard_docs
def dashboard(request):
    total_products = Products.objects.count()
    low_stock_items = Products.objects.filter(stock__lt=10).count()
    return Response({
        'total_products': total_products,
        'low_stock_items': low_stock_items,
    })

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAuthenticated]

    @product_list_docs
    def get_queryset(self):
        queryset = Products.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset

@api_view(['GET'])
@permission_classes([AllowAny])
@home_docs
def home(request):
    """Check if user is authenticated based on token in header"""
    auth_header = request.META.get('HTTP_AUTHORIZATION', '')
    if (auth_header.startswith('Token ')):
        token_key = auth_header.split(' ')[1]
        try:
            token = Token.objects.get(key=token_key)
            user = token.user
            return Response({
                'authenticated': True,
                'token': token_key,
                'user': UserSerializer(user).data
            })
        except Token.DoesNotExist:
            pass
    
    return Response({
        'authenticated': False
    })