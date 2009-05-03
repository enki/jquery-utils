from django.db import models

class Test(models.Model):

    charRequired   = models.CharField(u"Char field (required)", blank=False, max_length=200)
    charRequired   = models.CharField(u"Char field (optional)", blank=True, max_length=200)
    charMaxlength  = models.CharField(u"Char field (max 10)", max_length=10)
    boolean        = models.BooleanField(u"Boolean")
    csif           = models.CommaSeparatedIntegerField(max_length=200)
    date           = models.DateField()
    datetime       = models.DateTimeField()
    decimal        = models.DecimalField(decimal_places=3, max_digits=3)
    emailMaxlength = models.EmailField(u"Email (max 75)", max_length=75)
    floatfield     = models.FloatField()
    integer        = models.IntegerField()
    psif           = models.PositiveSmallIntegerField()
    slug           = models.SlugField()
    sif            = models.SmallIntegerField()
    textfield      = models.TextField(u"Notes")
    time           = models.TimeField()
    url            = models.URLField(u"URL (max 200)")
    xml            = models.URLField(u"XML")

    class Meta:
        verbose_name = u'Test'
        verbose_name_plural = u'Tests'

