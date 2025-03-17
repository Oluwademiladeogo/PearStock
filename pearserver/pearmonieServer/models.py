from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone
from .managers import CustomUserManager 
from phonenumber_field.modelfields import PhoneNumberField  
from django.core.validators import MinValueValidator

class CustomUser(AbstractUser):
    email = models.EmailField(unique=True, blank=False, null=False)
    phone_number = PhoneNumberField(blank=True, null=True)
    street_address = models.CharField(max_length=255, blank=True, null=True)
    city = models.CharField(max_length=100, blank=True, null=True)
    state_province = models.CharField(max_length=100, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    country = models.CharField(max_length=100, blank=True, null=True)
    date_joined = models.DateTimeField(auto_now_add=True) 
    
    username = None 
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = [] 
    objects = CustomUserManager()
    def __str__(self):
        return self.email
    
class Products(models.Model):
    name = models.CharField(max_length=100, unique=True, blank=False, null=False)
    model = models.CharField(max_length=50, blank=False, null=False)
    type = models.CharField(max_length=30, blank=False, null=False)
    store = models.CharField(max_length=50, blank=False, null=False)
    price = models.DecimalField(
        max_digits=10, 
        decimal_places=2, 
        validators=[MinValueValidator(0)],
        blank=False, 
        null=False
    )
    image = models.TextField(max_length=100, blank=False, null=False)
    stock = models.PositiveIntegerField(validators=[MinValueValidator(1)], blank=False, null=False)
    created_at = models.DateTimeField(default=timezone.now)
    updated_at = models.DateTimeField(auto_now=True)
    def __str__(self):
        return self.name