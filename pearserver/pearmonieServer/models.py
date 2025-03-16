from django.db import models
from django.core.validators import MinValueValidator

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
    image = models.CharField(max_length=100, blank=False, null=False)
    stock = models.PositiveIntegerField(validators=[MinValueValidator(1)], blank=False, null=False)
    
    def __str__(self):
        return self.name