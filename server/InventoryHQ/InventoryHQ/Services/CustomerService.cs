using AutoMapper;
using AutoMapper.QueryableExtensions;
using InventoryHQ.Data;
using InventoryHQ.Data.Models;
using InventoryHQ.Extensions;
using InventoryHQ.Models.DTOs;
using InventoryHQ.Models.Request;
using Microsoft.EntityFrameworkCore;
using System.Linq.Dynamic.Core;

namespace InventoryHQ.Services
{
    public class CustomerService
    {
        private readonly InventoryHQDbContext _data;
        private readonly IMapper _mapper;

        public CustomerService(InventoryHQDbContext data, IMapper mapper)
        {
            _data = data;
            _mapper = mapper;
        }

        public async Task<CustomerDto?> GetById(int id)
        {
            var customer = await _data.Customers
                                .Where(x => x.Id == id)
                                .Include(x => x.Receivers)
                                .Include(x => x.CustomerGroup)
                                .FirstOrDefaultAsync();

            return _mapper.Map<CustomerDto>(customer);
        }

        public async Task<IEnumerable<CustomerDto>> GetCustomers()
        {
            var data = await _data.Customers
                            .Include(x => x.Receivers)
                            .Include(x => x.CustomerGroup)
                            .ToListAsync();

            var customers = _mapper.Map<IEnumerable<CustomerDto>>(data);

            return customers;
        }

        public async Task<int?> CreateCustomer(CustomerDto customerDto)
        {
            var customer = _mapper.Map<Customer>(customerDto);
            await _data.Customers.AddAsync(customer);

            await _data.SaveChangesAsync();

            return customer.Id;
        }

        public async Task<int?> UpdateCustomer(CustomerDto customerDto)
        {
            var customer = await _data.Customers.FirstAsync(x => x.Id == customerDto.Id);

            if (customer == null)
            {
                return null;
            }

            _mapper.Map(customerDto, customer);

            await _data.SaveChangesAsync();
            return customer.Id;
        }

        public async Task<int?> DeleteCustomer(int id)
        {
            var customer = await _data.Customers.FirstOrDefaultAsync(x => x.Id == id);

            if (customer == null)
            {
                return null;
            }

            _data.Customers.Remove(customer);
            await _data.SaveChangesAsync();

            return customer.Id;
        }
    }
}
