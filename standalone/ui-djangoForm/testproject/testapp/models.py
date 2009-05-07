from django.db import models

class Test(models.Model):
    boolean        = models.BooleanField(u"Boolean")
    char           = models.CharField(u"Char field (required)", blank=False, max_length=200)
    date           = models.DateField()
    datetime       = models.DateTimeField()
    decimal        = models.DecimalField(decimal_places=3, max_digits=3)
    email          = models.EmailField(u"Email (max 75)", max_length=75)
    float          = models.FloatField()
    integer        = models.IntegerField()
    ipAddress      = models.IPAddressField()
    slug           = models.SlugField()
    time           = models.TimeField()
    url            = models.URLField(u"URL (max 200)")

    class Meta:
        verbose_name = u'Test'
        verbose_name_plural = u'Tests'

