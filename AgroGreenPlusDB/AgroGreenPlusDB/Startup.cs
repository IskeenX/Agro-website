using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.EntityFrameworkCore;
using AgroGreenPlusDB.Model;

namespace AgroGreenPlusDB
{
    public class Startup
    {
        // Constructor to initialize configuration
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        // Read-only property to access configuration
        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // Add database context with SQL Server provider
            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(Configuration.GetConnectionString("Server=localhost;Database=products;Trusted_Connection=True;MultipleActiveResultSets=true")));

            // Add other services here
            // Example: services.AddControllers();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            // Configure the HTTP request pipeline here
            // Example: if (env.IsDevelopment()) { app.UseDeveloperExceptionPage(); }

            // Configure routing, middleware, etc.
            // Example: app.UseRouting();

            // Seed database or perform other initialization tasks if needed
        }
    }
}
