from drf_yasg import openapi
from drf_yasg.utils import swagger_auto_schema
from .serializers import UserSerializer, ProductSerializer

security_token = openapi.SecurityScheme(
    type=openapi.TYPE_API_KEY,
    name='Authorization',
    in_=openapi.IN_HEADER,
    description='Token <your_token>',
)

security_requirement = {
    'TokenAuth': []  # 
}

token_param = openapi.Parameter(
    'Authorization',
    openapi.IN_HEADER,
    description="Token <your_token>",
    type=openapi.TYPE_STRING
)

login_docs = swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email address'),
            'password': openapi.Schema(type=openapi.TYPE_STRING, description='Password'),
        }
    ),
    responses={200: 'Token and user data', 401: 'Invalid credentials'}
)

signup_docs = swagger_auto_schema(
    request_body=UserSerializer,
    responses={201: 'Token and user data', 400: 'Bad request'}
)

forgot_password_docs = swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'email': openapi.Schema(type=openapi.TYPE_STRING, description='Email address'),
        }
    ),
    responses={200: 'Reset email sent'}
)

verify_otp_docs = swagger_auto_schema(
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        properties={
            'otp': openapi.Schema(type=openapi.TYPE_STRING, description='OTP code'),
        }
    ),
    responses={200: 'OTP verified'}
)

logout_docs = swagger_auto_schema(
    manual_parameters=[token_param],
    security=[security_requirement], 
    responses={200: 'Logged out successfully'}
)

dashboard_docs = swagger_auto_schema(
    manual_parameters=[token_param],
    security=[security_requirement],  
    responses={200: 'Dashboard statistics'}
)

product_list_docs = swagger_auto_schema(
    operation_description="Retrieve a list of products",
    manual_parameters=[token_param],
    security=[security_requirement],  
    responses={200: ProductSerializer(many=True)}
)

home_docs = swagger_auto_schema(
    operation_description="Check if user is authenticated based on token in header",
    manual_parameters=[token_param],
    responses={
        200: openapi.Response(
            description="Authentication status",
            schema=openapi.Schema(
                type=openapi.TYPE_OBJECT,
                properties={
                    'authenticated': openapi.Schema(type=openapi.TYPE_BOOLEAN),
                    'token': openapi.Schema(type=openapi.TYPE_STRING),
                    'user': UserSerializer,
                }
            )
        )
    }
)