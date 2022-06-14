using Microsoft.VisualBasic.FileIO;
using Microsoft.AspNetCore.Mvc;
using System.Data;
using Newtonsoft.Json; 

namespace core_angular_autocomplete.Controllers;

[ApiController]
[Route("[controller]")]
public class CitiesController : ControllerBase
{
    private static string ReadCSVFile(string csv_file_path)
        {
            DataTable csvData = new DataTable();
            string jsonString = string.Empty;
            try
            {
                using (TextFieldParser csvReader = new TextFieldParser(csv_file_path))
                {
                    csvReader.SetDelimiters(new string[] { "," });
                    csvReader.HasFieldsEnclosedInQuotes = true;
                    string[] colFields;
                    bool tableCreated = false;
                    while (tableCreated == false)
                    {
                        colFields = csvReader.ReadFields();
                        foreach (string column in colFields)
                        {
                            DataColumn datecolumn = new DataColumn(column);
                            datecolumn.AllowDBNull = true;
                            csvData.Columns.Add(datecolumn);
                        }
                        tableCreated = true;
                    }
                    while (!csvReader.EndOfData)
                    {
                        csvData.Rows.Add(csvReader.ReadFields());
                    }
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.Message);
                return "Error:Parsing CSV";
            }
            //if everything goes well, serialize csv to json 
            jsonString = JsonConvert.SerializeObject(csvData);
 
            return jsonString;
        }

    private readonly ILogger<CitiesController> _logger;

    public CitiesController(ILogger<CitiesController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public IEnumerable<City> Get(string name)
    {
        string jsonString = ReadCSVFile("world-cities_csv.csv");
        List<City> cities = (List<City>)JsonConvert.DeserializeObject(jsonString,(typeof(List<City>)));
        return cities;
    }

}
