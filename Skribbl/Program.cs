using Skribbl.Endpoints;
using Skribbl.Interfaces;
using Skribbl.Models;
using Skribbl.Services;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddCors(options => {
    options.AddPolicy("VitePolicy", policy => {
        policy.WithOrigins("http://localhost:5173") 
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials(); 
    });
});

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IGameManager,GameManager>();
builder.Services.AddSingleton<IGameService,GameService>();
builder.Services.AddSignalR();



var app = builder.Build();

app.UseCors("VitePolicy");
app.MapServiceEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.MapHub<GameHub>("/gamehub");
app.Run();
