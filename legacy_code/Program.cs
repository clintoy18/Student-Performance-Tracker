var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// These are for serving frontend (not needed if frontend runs separately)
// app.UseDefaultFiles();
// app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

// Redirect root (/) to swagger
app.MapGet("/", () => Results.Redirect("/swagger"));

// Only needed if backend serves React index.html fallback
// app.MapFallbackToFile("/index.html");

app.Run();
