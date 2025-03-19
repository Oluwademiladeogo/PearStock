import pytest
from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import APIClient

User = get_user_model()


@pytest.fixture
def api_client():
    return APIClient()


@pytest.fixture
def create_user():
    def _create_user(email="test@example.com", password="test_password", **kwargs):
        return User.objects.create_user(email=email, password=password, **kwargs)

    return _create_user


@pytest.fixture
def authenticated_client(api_client, create_user):
    user = create_user()
    token, _ = Token.objects.get_or_create(user=user)
    api_client.credentials(HTTP_AUTHORIZATION=f"Token {token.key}")
    return api_client, user, token


@pytest.mark.django_db
class TestUserAuthentication:
    def test_signup_success(self, api_client):
        url = reverse("signup")
        user_data = {
            "email": "newuser@example.com",
            "password": "newpassword123",
            "first_name": "New",
            "last_name": "User",
        }
        response = api_client.post(url, user_data, format="json")
        assert response.status_code == status.HTTP_201_CREATED

    def test_signup_invalid_data(self, api_client):
        url = reverse("signup")
        user_data = {"email": "invalid-email", "password": "short"}
        response = api_client.post(url, user_data, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_success(self, api_client, create_user):
        url = reverse("login")
        create_user(email="login@example.com", password="login_password")
        response = api_client.post(
            url,
            {"email": "login@example.com", "password": "login_password"},
            format="json",
        )
        assert response.status_code == status.HTTP_200_OK

    def test_login_invalid_credentials(self, api_client, create_user):
        url = reverse("login")
        create_user(email="login@example.com", password="login_password")
        response = api_client.post(
            url,
            {"email": "login@example.com", "password": "wrong_password"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_login_nonexistent_user(self, api_client):
        url = reverse("login")
        response = api_client.post(
            url,
            {"email": "nonexistent@example.com", "password": "password"},
            format="json",
        )
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_logout(self, authenticated_client):
        client, user, token = authenticated_client
        url = reverse("logout")
        response = client.post(url)
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestDashboard:
    def test_dashboard_authenticated(self, authenticated_client):
        client, user, _ = authenticated_client
        url = reverse("dashboard")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_dashboard_unauthenticated(self, api_client):
        url = reverse("dashboard")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED


@pytest.mark.django_db
class TestHome:
    def test_home_authenticated(self, authenticated_client):
        client, user, token = authenticated_client
        url = reverse("home")
        response = client.get(url)
        assert response.status_code == status.HTTP_200_OK

    def test_home_unauthenticated(self, api_client):
        url = reverse("home")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK


@pytest.mark.django_db
class TestHealthCheck:
    def test_health_check(self, api_client):
        url = reverse("health_check")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert response.content.decode() == "OK"