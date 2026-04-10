using Skribbl.Endpoints;
using Skribbl.Interfaces;
using Skribbl.Models;
using Skribbl.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddSingleton<IGameManager,GameManager>();
builder.Services.AddSingleton<IGameService,GameService>();
builder.Services.AddSignalR();



var app = builder.Build();

app.MapServiceEndpoints();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

