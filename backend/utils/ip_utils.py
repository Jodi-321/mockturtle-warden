'''
IP utility functions for parsing and validating allowed IP networks
'''

import ipaddress
from typing import List

def parse_allowed_ips(ip_string:str) -> List[ipaddress._BaseNetwork]:
    '''
    Parses a comma-seperated list of IP addresses/CIDRs into ip_network objects

    Args:
        ip_string (str): The raw environment variable string

    Returns:
        List[ipaddress._BaseNetwork]: Parsed IP networks
    '''
    return [ipaddress.ip_network(ip.strip()) for ip in ip_string.split(",") if ip.strip()]