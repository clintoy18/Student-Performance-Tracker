var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Optional: uncomment if you want HTTPS locally
// app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// 👇 Add a simple root endpoint instead of SPA fallback
app.MapGet("/", () => "✅ Backend is running!");

app.Run();
