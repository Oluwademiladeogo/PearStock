from rest_framework import status, viewsets
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from .serializers import UserSerializer, ProductSerializer
from pearmonieServer.models import Products
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email address'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
        }
    ),
    responses={200: 'Token and user data', 401: 'Invalid credentials'}
)
@api_view(['POST'])
@permission_classes([AllowAny])
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

@swagger_auto_schema(
    method='post',
    request_body=UserSerializer,
    responses={201: 'Token and user data', 400: 'Bad request'}
)
@api_view(['POST'])
@permission_classes([AllowAny])
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

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email address'),
        }
    ),
    responses={200: 'Reset email sent'}
)
@api_view(['POST'])
@permission_classes([AllowAny])
def forgot_password(request):
    email = request.data.get('email')
    # Implement password reset logic here
    return Response({'message': 'Reset email sent'})

@swagger_auto_schema(
    method='post',
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'otp': openapi.Schema(type=openapi.TYPE_STRING, description='OTP code'),
        }
    ),
    responses={200: 'OTP verified'}
)
@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    otp = request.data.get('otp')
    # Implement OTP verification logic here
    return Response({'message': 'OTP verified'})

@swagger_auto_schema(
    method='post',
    responses={200: 'Logged out successfully'}
)
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    request.user.auth_token.delete()
    return Response({'message': 'Logged out successfully'})

@swagger_auto_schema(
    method='get',
    responses={200: 'Dashboard statistics'}
)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
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

    @swagger_auto_schema(
        operation_description="Retrieve a list of products",
        responses={200: ProductSerializer(many=True)}
    )
    def get_queryset(self):
        queryset = Products.objects.all()
        search = self.request.query_params.get('search', None)
        if search:
            queryset = queryset.filter(name__icontains=search)
        return queryset