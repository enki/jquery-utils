from django.db import models

class Test(models.Model):
    boolean        = models.BooleanField(u"Boolean")
    char           = models.CharField(u"Char field", blank=False, max_length=200)
    date           = models.DateField(blank=True)
    datetime       = models.DateTimeField(blank=True)
    decimal        = models.DecimalField(decimal_places=3, max_digits=3, blank=True)
    email          = models.EmailField(u"Email", max_length=75, blank=True)
    float          = models.FloatField(blank=True)
    integer        = models.IntegerField(blank=True)
    ipAddress      = models.IPAddressField(blank=True)
    slug           = models.SlugField(blank=True)
    time           = models.TimeField(blank=True)
    url            = models.URLField(u"URL (max 200)", blank=True)

    class Meta:
        verbose_name = u'Test'
        verbose_name_plural = u'Tests'

