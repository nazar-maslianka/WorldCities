using IdentityServer4.EntityFramework.Options;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Threading.Tasks;
using WorldCities.Controllers;
using WorldCities.Data;
using WorldCities.Data.Models;
using Xunit;

namespace WorldCities.Tests.ControllersTests
{
    public class CitiesController_Tests
    {
        /// <summary>
        /// Test the GetCity() method
        /// </summary>
        [Fact]
        public async Task GetCity() 
        {
            var options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: "WorldCities")
                .Options;
            var storeOptions = Options.Create(new OperationalStoreOptions());
            using (var context = new ApplicationDbContext(options, storeOptions))
            {
                context.Add(new City()
                {
                    Id = 1,
                    CountryId = 1,
                    Lat = 1,
                    Lon = 1,
                    Name = "TestCity1"
                });
                context.SaveChanges();
            }
            City city_exisitng = null;
            City city_notExisitng = null;

            using (var context = new ApplicationDbContext(options, storeOptions)) 
            {
                var controller = new CitiesController(context);
                city_exisitng = (await controller.GetCity(1)).Value;
                city_notExisitng = (await controller.GetCity(2)).Value;
            }

            Assert.True(
                city_exisitng != null
                && city_notExisitng == null
                );
        }
    }
}
